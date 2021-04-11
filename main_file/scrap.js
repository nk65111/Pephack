const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
let count=0;
let filename;


async function requestUrl(link,skill){
    //we use filename as a globle skills
     filename=skill
     request(link,cb);
}
function cb(error,response,data){
   parseBody(data);
}



function parseBody(data){
   let ch=cheerio.load(data);
   let allDivs=ch(`.jobsearch-SerpJobCard.unifiedRow.row.result`);
   let size=ch(allDivs).length;
   for(let i=0;i<size;i++){
       let OneDivTag=ch(allDivs[i]);
       let heading=ch(OneDivTag.find(`.title a`)).text().trim();
       let companyName=ch(OneDivTag.find(`.company`)).text().trim();
       let LocationAdress=ch(OneDivTag.find(`.location`)).text().trim();
       let ApplyLink=ch(OneDivTag.find(`.title a`)).attr("href");
       let CompleteApplyLink=`https://in.indeed.com`+ApplyLink;
       let JobDicription=ch(OneDivTag.find(`.summary`)).text().trim();

       //if job.json file is not created function will do that
       if(!fs.existsSync(`job.json`)){
           fs.writeFileSync(`job.json`,JSON.stringify([]));
       }else{
           let allData=JSON.parse(fs.readFileSync(`job.json`));

           //passing data as a object in job.json file
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
           fs.writeFileSync(`job.json`,JSON.stringify(allData));
       }
      
   }

  if(count<10){
  let AllLis= ch(".pagination-list li a");
  let NextLis=AllLis[AllLis.length-1];
  let NextBtn= ch(NextLis).attr("href");
  let completeNextBtn=`https://in.indeed.com`+NextBtn;
  
  count++;
  //recursion call for next page
  requestUrl(completeNextBtn,filename);
  }else{
      return;
  }
}

module.exports=requestUrl;