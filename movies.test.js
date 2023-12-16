const { clickElement, getText } = require("./lib/commands.js");
const { getDate } = require("./lib/util.js");

let page;

beforeEach(async () => {
  page = await browser.newPage();
  //await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Go to movies tests", () => {
  beforeEach(async () => {
    await page.goto("https://qamid.tmweb.ru/", {waitUntil: 'domcontentloaded'});
  });

  test("Бронирование билета", async () => {
    await clickElement(page,".page-nav__day:nth-child(2)");
    await clickElement(page, ".movie-seances__hall a");

    await page.waitForSelector(".buying-scheme__wrapper");
    await clickElement(page, ".buying-scheme__wrapper > :nth-child(3) > :nth-child(6)");
    await clickElement(page, ".acceptin-button");

    await page.waitForSelector(".ticket__info-wrapper");

    let resultText = [];
    for (let i = 1; i < 6; i++) {
      try {
        let text = await getText(page, `.ticket__info-wrapper > p:nth-child(${i}) > span`);
        resultText.push(text);
      } catch (e) {
        console.error(`Error while getting text for paragraph ${i}`, e);
      }
    }

    const actual = resultText;
    const expected = ["Зверополис", "3/6", "Зал 2", getDate(1), "11:00"];
    expect(actual).toEqual(expected);
  });


  test("Покупка нескольких билетов", async () => {
    await clickElement(page, ".page-nav__day:nth-child(3)");
    await clickElement(page, ".movie-seances__hall a");
    
    await page.waitForSelector(".buying-scheme__wrapper");

    let place4 = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(4)";
    let place5 = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(5)";
    let place6 = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(6)";
    let place7 = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(7)";
    let place8 = ".buying-scheme__wrapper > :nth-child(6) > :nth-child(8)";

    await clickElement(page, place4);
    await clickElement(page, place5);
    await clickElement(page, place6);
    await clickElement(page, place7);
    await clickElement(page, place8);
    await clickElement(page, ".acceptin-button");

    await page.waitForSelector(".ticket__info-wrapper");

    await getText(page, `.ticket__info:nth-child(1) > span`);
    const numberOfparagraph = 6;
    let resultText = [];
    for (let i = 1; i < numberOfparagraph; i++) {
      try {
        let text = await getText(page, `.ticket__info:nth-child(${i}) > span`);
        resultText.push(text);
      } catch (e) {
        console.error(`Error while getting text for paragraph ${i}`, e);
      }
    }
    const actual = resultText;
    const expected = await [
      "Зверополис",
      "6/4, 6/5, 6/6, 6/7, 6/8",
      "Зал 2",
      getDate(2),
      "11:00",
    ];
    expect(actual).toEqual(expected);
  });


  test("Покупка билета на занятое место", async () => {
    await clickElement(page, ".page-nav__day:nth-child(4)");
    await clickElement(page, ".movie-seances__hall a");

    await page.waitForSelector(".buying-scheme__wrapper");
    await clickElement(page, ".buying-scheme__wrapper > :nth-child(1) > :nth-child(3)");

    const actual = await page.$eval(".acceptin-button", (link) =>
      link.getAttribute("disabled")
    );
    expect(actual).toEqual("true");
  }, 5000);
});
