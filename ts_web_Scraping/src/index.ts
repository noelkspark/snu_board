import axios from "axios";
import cheerio from "cheerio";

const main_url = "http://ie.snu.ac.kr/";
const main_notice = "http://ie.snu.ac.kr/ko/board/2";
const AxiosInst = axios.create();

function get_url(URL) {
  AxiosInst.get(URL)
    .then((response) => {
      const html = response.data; // Get the HTML from the HTTP request
      const $ = cheerio.load(html); // Load the HTML string into cheerio
      const $title_carriage = $("tbody > tr");
      const $title = $title_carriage.find($(".views-field-title-field"));
      console.log($title.text()); // Log the number of captured elements
    })
    .catch(console.error);
}

get_url(main_notice);
