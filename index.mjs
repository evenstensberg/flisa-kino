import fs from "node:fs"
import puppeteer from 'puppeteer'
;(async () => {

  
  const date = '22.03.2023'; // Onsdag eller Søndag
  const location = "Flisa";
  const jsonPath = `./data/${date}.kino.json`
  fs.writeFileSync(jsonPath,JSON.stringify([], null, 4), "utf8")

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(`https://www.filmweb.no/program?location=${location}#${date}`)
  await page.setViewport({ width: 1080, height: 1024 })
  const movieArray = await page.$$('.Program_Movie__PWATw')
  movieArray.map(async el => {
    const ageWrapper = await el.$('.Movie_Rating__KuqnP');
    const age = await ageWrapper.evaluate(e => e.textContent);
    
    const durationWrapper = await el.$('.Movie_Time__7EUbb');
    const duration = await durationWrapper.evaluate(e => e.textContent);

    const categoryWrapper =  await el.$('.Movie_Genre__Cqw7V');
    const categories = await categoryWrapper.evaluate(e => e.textContent);
    
    const timeWrapper = await el.$('.show_time__7MbtR');
    const time = await timeWrapper.evaluate(e => e.textContent);

    const placeWrapper = await el.$('.show_screen__RHrug');
    const place = await placeWrapper.evaluate(e => e.textContent);
    
    const titleWrapper = await el.$('.Movie_Title__7OfmT');
    const title = await titleWrapper.evaluate(e => e.textContent);

    const imgWrapper = await el.$('.moviePosterImage_PosterSizer__93gJ- > img');
    const img = await imgWrapper.evaluate(e => e.srcset.split(" ")[0])
    const data = {
      age, duration, categories, time, place, title, img, date
    }
    const jsonFileContents = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    jsonFileContents.push(data)
    fs.writeFileSync(jsonPath, JSON.stringify(jsonFileContents, null, 4), "utf8")
  })
  setTimeout(async() => {
    await browser.close()
  }, 3000)
})()
