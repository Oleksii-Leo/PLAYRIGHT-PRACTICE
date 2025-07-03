import { mergeTests } from "@playwright/test";
import { test as pageFixtures } from "./pageFixtures";
import { test as screenSizeFixtures } from "./screenSizeFixtures";

export const test = mergeTests(pageFixtures, screenSizeFixtures);
