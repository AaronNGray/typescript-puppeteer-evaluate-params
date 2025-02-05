import { Page } from "puppeteer";

function handlerCaller(
  handlerFunction: string,
  doc: Document,
  context: any
): Function {
  const fn = new Function("return " + handlerFunction)();
  return fn(doc || document, context);
}

const mockDoc = {} as Document;

export async function callHandler(
  page: Page,
  handlerFunction: Function,
  context: any
): Promise<any> {
  page.evaluate(handlerCaller, handlerFunction.toString(), mockDoc, context);
}
