import test from "@playwright/test";

export function step<T>(_stepName?: string) {
  return function (
    target: (...args: any[]) => Promise<T>,
    context: ClassMethodDecoratorContext
  ) {
    return function (this: any, ...args: any[]): Promise<T> {
      const isStatic = typeof this === "function";
      const className = isStatic
        ? this.name
        : getOriginalClass(this, context.name.toString());
      const methodDetails = `${className}.${context.name.toString()}`;

      const { paramNames, defaultValues } = extractFunctionParamNames(target);

      const name = _stepName
        ? `${replacePlaceholders(
            _stepName,
            args,
            paramNames,
            defaultValues
          )} - ${methodDetails}`
        : methodDetails;

      const error = new Error("Capturing stack trace");
      const stackLines = error.stack?.split("\n") || [];
      const stack = stackLines.find(
        (line) => line.includes(".ts:") && !line.includes("step-decorator.ts")
      );
      const filePath = stack?.match(/tests\/(.+)/);
      const finalPath = filePath ? `.../${filePath[1]}` : null;

      const stepNameWithStack = `${name} — ${finalPath}`;

      return test.step(stepNameWithStack, async () => {
        return (await target.call(this, ...args)) as T;
      });
    };
  };
}

// Helper to get the class name
function getOriginalClass(instance: any, methodName: string): string {
  return instance.constructor?.name || "UnknownClass";
}

// Helper to extract parameter names and default values from a function
function extractFunctionParamNames(fn: Function): {
  paramNames: string[];
  defaultValues: any[];
} {
  const fnStr = fn.toString();
  const result = /\(([^)]*)\)/.exec(fnStr);
  const paramNames =
    result && result[1]
      ? result[1]
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
  // No reliable way to get default values in JS, so return empty array
  return { paramNames, defaultValues: [] };
}

// Helper to replace placeholders in a string with argument values
function replacePlaceholders(
  str: string,
  args: any[],
  paramNames: string[],
  defaultValues: any[]
): string {
  let result = str;
  paramNames.forEach((name, idx) => {
    const value =
      args[idx] !== undefined ? args[idx] : defaultValues[idx] ?? "";
    result = result.replace(new RegExp(`\\$\{${name}\}`, "g"), value);
  });
  return result;
}
