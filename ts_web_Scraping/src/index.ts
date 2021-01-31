import axios from "axios";
import cheerio from "cheerio";

const ie_main_url: string = "http://ie.snu.ac.kr";
const ie_notice_main: string = "http://ie.snu.ac.kr/ko/board/2";

let ie_main_notice_urlList = [];
let ie_main_notice_urlTitle = [];
let ie_main_notice_urlDate = [];
let ie_main_notice_urlContent = [];

async function get_element_urls(url: string) {
  //////////get urls from some boards
  const AxiosInst = axios.create();
  await AxiosInst.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const $board_element = $("tbody > tr > td > a");

      $board_element.each((index, value) => {
        const $link = $(value).attr("href");
        ie_main_notice_urlList.push($link);
      });
    })
    .catch(console.error);
}

async function crawl_info() {
  /////////////////////get info from crawled urls from <function : get_element_urls>
  await get_element_urls(ie_notice_main); ////////title, date, and content
  const len = ie_main_notice_urlList.length;

  for (let i = 0; i < len; i++) {
    const AxiosInst = axios.create();
    await AxiosInst.get(ie_main_url + ie_main_notice_urlList[i])
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const $title = $("div.field-item > h2");
        const $date = $("div.field-name-post-date > .field-items");
        const $content = $("div.field-items > .field-item");
        ie_main_notice_urlTitle.push($title.text());
        ie_main_notice_urlDate.push($date.text());
        ie_main_notice_urlContent.push($content.text());
        console.log(ie_main_notice_urlContent);
      })
      .catch();
  }
}

async function debug_print() {
  await get_element_urls(ie_notice_main);

  console.log(ie_main_notice_urlList.length);
  for (let i = 0; i < ie_main_notice_urlList.length; i++) {
    console.log(ie_main_notice_urlList[i]);
  }
}

crawl_info();
