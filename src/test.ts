import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

async function main(url:string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-notifications"],
        defaultViewport: null
    });

    const page = (await browser.pages())[0];

    const response = await page?.goto(url); // !!!

    if (response?.status() !== 200) {
        console.error('Error: page not loaded');
        return;
    }

    const handlerFunction = (doc:Document, context:any) => {
        var match:HTMLElement|null;
        context.headerIndex = 0;
        while (++context.headerIndex < 10) {
            if (match = document.querySelector('h' + context.headerIndex))
                return match.innerText;
        };
        return null;
    }
    const context = {context: 'context'};

    console.log("Header: ", await callHandler(page, handlerFunction, context));

    if (page)
        await page.close;

    if (browser)
        await browser.close();

}

function handlerCaller(handlerFunction:string, context:{}):Function {
    const fn = new Function('return ' + handlerFunction)();
    return fn(document, context);
}


// evaluate<Params extends unknown[], Func extends EvaluateFunc<Params> = EvaluateFunc<Params>>(pageFunction: Func | string, ...args: Params): Promise<Awaited<ReturnType<Func>>>;

async function callHandler(page:Page, handlerFunction:Function, context:{}):Promise<any> {
    return page.evaluate(handlerCaller, handlerFunction.toString(), context);
}

main('https://theguardian.com').catch(console.error);
