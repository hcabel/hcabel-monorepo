
export type IQuery = (...args: any[]) => Promise<any>;
export type Nested<T> = { [P in keyof T]: T[P] | Nested<T[P]> };

export interface IDatabase<T extends Nested<IQuery> = Nested<IQuery>> {
	connect(): Promise<boolean>,
	queries: T
}