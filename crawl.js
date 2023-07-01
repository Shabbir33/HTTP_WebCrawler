const {JSDOM} = require("jsdom")
const fetch = require("node-fetch")

async function crawlPage(currentURL){
    console.log(`Actively Crawling: ${currentURL}`)

    try{
        const response = await fetch(currentURL)

        if(response.status > 399){
            console.log(`Error in fetch with status code: ${response.status}, on page: ${currentURL}`)
            return
        }

        const contentType = response.headers.get("content-type")
        console.log(contentType)
        if(!contentType.includes("text/html")){
            console.log(`Non HTML response, Content Type: ${contentType}, on page: ${currentURL}`)
            return
        }   

        console.log(await response.text())
    }catch(err){
        console.log(`Error in fetch: ${err.message}, on page: ${currentURL}`)
    }

}


function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements){
        if(linkElement.href.slice(0,1) === "/"){
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            }catch(error){
                console.log(`error with relative URL: ${error.message}`)
            }
        }else{
            //absolute
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            }catch(error){
                console.log(`error with absolute URL: ${error.message}`)
            }
        }
    }
    return urls
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === "/"){
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}