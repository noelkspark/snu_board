import axios from "axios";
import cheerio from "cheerio";

const ie_main_url: string = "http://ie.snu.ac.kr";

const ie_main_news: string = "http://ie.snu.ac.kr/ko/board/2";
const ie_notice_UD: string = "http://ie.snu.ac.kr/ko/board/7";
const ie_notice_GS: string = "http://ie.snu.ac.kr/ko/board/8";
const ie_notice_recruit: string = "http://ie.snu.ac.kr/ko/board/6";
const ie_notice_scholship: string = "http://ie.snu.ac.kr/ko/board/15";

const eng_main_url: string = "https://eng.snu.ac.kr";
const eng_notice: string = "https://eng.snu.ac.kr/notice";
const eng_scholship: string = "https://eng.snu.ac.kr/janghak";
const eng_recruit: string = "https://eng.snu.ac.kr/recruit";

const ie_main_newsURLs = [];
const ie_main_newsList = [];
const ie_notice_UDURLs = [];
const ie_notice_UDList = [];
const ie_notice_GSURLs = [];
const ie_notice_GSList = [];
const ie_notice_recruitURLs = [];
const ie_notice_recruitList = [];
const ie_notice_scholshipURLs = [];
const ie_notice_scholshipList = [];

/*
let ie_main_notice_urlList = [];
let ie_main_notice_urlTitle = [];
let ie_main_notice_urlDate = [];
let ie_main_notice_urlContent = [];
*/
async function get_element_urls(url: string, url_list) {
  //////////get urls from some boards
  const AxiosInst = axios.create();
  await AxiosInst.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const $board_element = $("tbody > tr > td > a");

      $board_element.each((index, value) => {
        const $link = $(value).attr("href");
        url_list.push($link);
      });
    })
    .catch(console.error);
}

async function ie_crawl_info(
  main_url: string,
  board_url: string,
  url_list: string[],
  final_list
) {
  /////////////////////get info from crawled urls from <function : get_element_urls>
  await get_element_urls(board_url, url_list); ////////title, date, and content
  const len = url_list.length;

  for (let i = 0; i < len; i++) {
    const AxiosInst = axios.create();
    await AxiosInst.get(main_url + url_list[i])
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const $title = $("div.field-item > h2"); //get title
        const $date = $("div.field-name-post-date > .field-items"); //get date
        const $content = $("div.field-items > .field-item"); // get full content
        final_list[i] = {
          title: $title.text(),
          date: $date.text(),
          content: $content.text(),
        };
        //ie_main_notice_urlTitle.push($title.text()); //save in <list : ie_main_notice_urlTitle>
        //ie_main_notice_urlDate.push($date.text()); //save in <list : ie_main_notice_urlDate>
        //ie_main_notice_urlContent.push($content.text()); //save in <list : ie_main_notice_urlContent>
        console.log(final_list);
      })
      .catch();
  }
}
/*
async function debug_print() {
  await get_element_urls(ie_main_news,);

  console.log(ie_main_notice_urlList.length);
  for (let i = 0; i < ie_main_notice_urlList.length; i++) {
    console.log(ie_main_newsList[i]);
  }
}
*/
ie_crawl_info(ie_main_url, ie_main_news, ie_main_newsURLs, ie_main_newsList); //학과 주요 뉴스 crawl
ie_crawl_info(ie_main_url, ie_notice_UD, ie_notice_UDURLs, ie_notice_UDList); //학부 공지 사항 crawl
ie_crawl_info(ie_main_url, ie_notice_GS, ie_notice_GSURLs, ie_notice_GSList); //대학원 공지 사항 crawl
ie_crawl_info(
  ie_main_url,
  ie_notice_recruit,
  ie_notice_recruitURLs,
  ie_notice_recruitList
); //취직 공지 사항 crawl
ie_crawl_info(
  ie_main_url,
  ie_notice_scholship,
  ie_notice_scholshipURLs,
  ie_notice_scholshipList
); //장학 공지 사항 crawl
