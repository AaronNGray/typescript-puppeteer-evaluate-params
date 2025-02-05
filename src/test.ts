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

    const handlerFunction = (doc:Document, dispatch:string, context:any) => {
        var match:HTMLElement|null;
        context.headerIndex = 0;
        while (++context.headerIndex < 10) {
            if (match = document.querySelector('h' + context.headerIndex))
                return match.innerText;
        };
        return null;
    }
    const context = {};

    console.log("Header: ", await callHandler(page, handlerFunction, "", context));

    if (page)
        await page.close;

    if (browser)
        await browser.close();

}

function handlerCaller(handlerFunction:string, dispatch:string, context:{}):Function {
    const fn = new Function('return ' + handlerFunction)();
    return fn(document, dispatch, context);
}


async function callHandler(page:Page, handlerFunction:Function, dispatch:string, context:{}):Promise<any> {
    return page.evaluate(handlerCaller, handlerFunction.toString(), dispatch, context);
}

main('https://theguardian.com').catch(console.error);
