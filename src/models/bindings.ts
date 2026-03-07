// src/models/bindings.ts
import { Env } from "hono";

export type Bindings = {
	DB: D1Database;
	API_KEY: string;
};

export interface AppContext extends Env {
	Bindings: Bindings;
}
