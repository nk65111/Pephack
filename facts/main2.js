const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const { parseHTML } = require("cheerio");
const { head } = require("request");
let count=0;


//********************************* This File scrap all the data from indeed website************************ */
let IndeedLink=`https://in.indeed.com/jobs-in-India`;
function reuestUrl(link){
request(link,cb);
}
function cb(error,response,data){
    parseBody(data);
}



function parseBody(data){
    let ch=cheerio.load(data);
    let allDivs=ch(`.jobsearch-SerpJobCard.unifiedRow.row.result`);
    let size=ch(allDivs).length;
    console.log(count);
    for(let i=0;i<size;i++){
        let OneDivTag=ch(allDivs[i]);
        let heading=ch(OneDivTag.find(`.title a`)).text().trim();
        let companyName=ch(OneDivTag.find(`.company`)).text().trim();
        let LocationAdress=ch(OneDivTag.find(`.location`)).text().trim();
        let ApplyLink=ch(OneDivTag.find(`.title a`)).attr("href");
        let CompleteApplyLink=`https://in.indeed.com`+ApplyLink;
        let JobDicription=ch(OneDivTag.find(`.summary`)).text().trim();
        if(!fs.existsSync("./job.json")){
            fs.writeFileSync("./job.json",JSON.stringify([]));
        }else{
            let allData=JSON.parse(fs.readFileSync("./job.json"));
            let obj={
                title:heading,
                company:companyName,
                applyLink:CompleteApplyLink,
                location:LocationAdress,
                responsibility:JobDicription
            }
            if(obj.title !== ""){
                allData.push(obj);
            }
            fs.writeFileSync("./job.json",JSON.stringify(allData));
        }
       
    }

   if(count<50){
   let AllLis= ch(".pagination-list li a");
   let NextLis=AllLis[AllLis.length-1];
   let NextBtn= ch(NextLis).attr("href");
   let completeNextBtn=`https://in.indeed.com`+NextBtn;
   
   count++;
   reuestUrl(completeNextBtn);
   }else{
       return;
   }
}
reuestUrl(IndeedLink);