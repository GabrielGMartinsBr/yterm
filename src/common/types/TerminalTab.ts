export type TerminalTabUid = string;

export interface TerminalTab {
    uid: TerminalTabUid;
    cwd?: string;
}