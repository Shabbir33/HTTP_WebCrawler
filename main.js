const { crawlPage } = require("./crawl")
const { printReport } = require("./report")

async function main(){
    if(process.argv.length < 3){
        console.log("No Website Provided.")
        process.exit(1)
    }
    if(process.argv.length > 3){
        console.log("To many Command Line args.")
        process.exit(1)
    }

    const baseURL = process.argv[2]

    console.log(`Starting Crawl of ${baseURL}`)

    const pages = await crawlPage(baseURL, baseURL, {})

    printReport(pages)
}

main()