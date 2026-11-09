/**
 * This file exports a `db` object, which serves as the primary reference to the
 * database and the Drizzle ORM.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "@/server/db/relations";

const connectionString = process.env.DATABASE_URL;

export const client = postgres(connectionString!, { prepare: false });

// In Drizzle 1.0, the relational query API (`db.query`) is driven by the
// `relations` object rather than the `schema` option used in 0.x.
export const db = drizzle({ client, relations });
