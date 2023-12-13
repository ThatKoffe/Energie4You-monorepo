/**
 * Register middleware
 */
import express from "express";
import { app } from "../app";
import cors from "cors";
import utils from "./utils";

// Accept json
app.use(express.json());
// Accept raw bytes
app.use(express.raw({ type: "*/*", limit: "20mb" }));
// Any other
app.use(cors());
app.use(utils);
