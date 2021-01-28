import axios from "axios";
import cheerio from "cheerio";

const main_url = "http://ie.snu.ac.kr/";
const notice_main = "http://ie.snu.ac.kr/ko/board/2";
const AxiosInst = axios.create();

function get_element_urls(URL) {
  let res = [];
  AxiosInst.get(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const $board_element = $("tbody > tr > td > a");
      //const $board_element_url = $board_element.attr("href");
      $board_element.each((index, value) => {
        const link = $(value).attr("href");
        res.push(link);
      });
      //console.log($board_element_url);
      for (let i = 0; i < res.length; i++) {
        console.log(res[i]);
      }
    })
    .catch(console.error);
}

get_element_urls(notice_main);
