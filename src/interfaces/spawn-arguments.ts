export interface SpawnArguments {
    command: string;
    args: string[];
    spawnOptions: {
        [key: string]: any;   
    };
}