import axios from "axios";
import cheerio from "cheerio";

const main_url: string = "http://ie.snu.ac.kr";
const notice_main = "http://ie.snu.ac.kr/ko/board/2";

let main_notice_urlList = [];
let main_notice_urlTitle = [];

async function get_element_urls(url: string) {
  const AxiosInst = axios.create();
  await AxiosInst.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const $board_element = $("tbody > tr > td > a");

      $board_element.each((index, value) => {
        const $link = $(value).attr("href");
        main_notice_urlList.push($link);
      });
    })
    .catch(console.error);
}

async function crawl_info() {
  await get_element_urls(notice_main);
  const len = main_notice_urlList.length;

  for (let i = 0; i < len; i++) {
    const AxiosInst = axios.create();
    await AxiosInst.get(main_url + main_notice_urlList[i])
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const $title = $("div.field-item > h2");

        main_notice_urlTitle.push($title.text());
        console.log(main_notice_urlTitle);
      })
      .catch();
  }
}

async function debug_print() {
  await get_element_urls(notice_main);

  console.log(main_notice_urlList.length);
  for (let i = 0; i < main_notice_urlList.length; i++) {
    console.log(main_notice_urlList[i]);
  }
}

crawl_info();
