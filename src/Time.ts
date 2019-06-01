import * as Scheduler from './Elm/Scheduler';
import {
    Task
} from './Task';
import {
    Process,
    Router,
    Fas,
    Sub,
    reg,
    sendToApp,
    sendToSelf
} from './Elm/Platform';


type Processes = Map<number, Process>;

type Taggers<Msg> = Map<number, Array<(posix: number) => Msg>>;

interface State<Msg> {
    taggers: Taggers<Msg>;
    processes: Processes;
}

const manager = reg(<AppMsg>() => ({
    init: Task.succeed({
        taggers: new Map(),
        processes: new Map()
    }),
    onEffects(
        router: Router<AppMsg, number>,
        _commands: Array<never>,
        subscriptions: Array<TimeSub<AppMsg>>,
        { processes }: State<AppMsg>
    ): Task<never, State<AppMsg>> {
        const expiredProcesses: Array<Process> = [];
        const newIntervals: Array<number> = [];
        const existingProcesses: Processes = new Map();
        const newTaggers: Taggers<AppMsg> = subscriptions.reduce(
            (acc: Taggers<AppMsg>, sub: TimeSub<AppMsg>): Taggers<AppMsg> => sub.register(acc),
            new Map()
        );

        for (const [ interval, existingProcess ] of processes) {
            if (newTaggers.has(interval)) {
                existingProcesses.set(interval, existingProcess);
            } else {
                expiredProcesses.push(existingProcess);
            }
        }

        for (const interval of newTaggers.keys()) {
            if (!existingProcesses.has(interval)) {
                newIntervals.push(interval);
            }
        }

        return Task.sequence(expiredProcesses.map((process: Process): Task<never, void> => process.kill()))
            .chain(() => newIntervals.reduce(
                (acc: Task<never, Processes>, interval: number): Task<never, Processes> => {
                    return acc.chain((processes: Processes) => {
                        return setEvery(interval, sendToSelf(router, interval))
                            .spawn()
                            .map((process: Process) => processes.set(interval, process));
                    });
                },
                Task.succeed(existingProcesses)
            )).map((newProcesses: Processes): State<AppMsg> => ({
                taggers: newTaggers,
                processes: newProcesses
            }));
    },
    onSelfMsg(
        router: Router<AppMsg, number>,
        interval: number,
        state: State<AppMsg>
    ): Task<never, State<AppMsg>> {
        const taggers = state.taggers.get(interval);

        if (taggers == null) {
            return Task.succeed(state);
        }

        const now = Date.now();

        return Task.sequence(
            taggers.map((tagger: (posix: number) => AppMsg) => sendToApp(router, tagger(now)))
        ).map(() => state);
    }
}));

abstract class TimeSub<AppMsg> extends Sub<AppMsg> {
    protected readonly manager: Fas<AppMsg, number, State<AppMsg>> = manager;

    public abstract register(taggers: Taggers<AppMsg>): Taggers<AppMsg>;
}

class Every<Msg> extends TimeSub<Msg> {
    public constructor(
        private readonly interval: number,
        private readonly tagger: (poxis: number) => Msg
    ) {
        super();
    }

    public map<R>(fn: (msg: Msg) => R): TimeSub<R> {
        return new Every(
            this.interval,
            (posix: number): R => fn(this.tagger(posix))
        );
    }

    public register(taggers: Taggers<Msg>): Taggers<Msg> {
        const bag = taggers.get(this.interval);

        if (bag == null) {
            taggers.set(this.interval, [ this.tagger ]);
        } else {
            bag.push(this.tagger);
        }

        return taggers;
    }
}

const setEvery = (timeout: number, task: Task<never, void>): Task<never, void> => {
    return Task.binding(() => {
        const intervalId = setInterval(() => {
            Scheduler.rawSpawn(task.execute());
        }, timeout);

        return () => clearInterval(intervalId);
    });
};

export const now: Task<never, number> = Task.binding((done: (task: Task<never, number>) => void): void => {
    done(Task.succeed(Date.now()));
});

export const every = <Msg>(interval: number, tagger: (posix: number) => Msg): Sub<Msg> => {
    return new Every(interval, tagger);
};
