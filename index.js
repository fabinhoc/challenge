const fs = require('fs')
const csv = require('csv-parser')
const _ = require('lodash')

const inputFile = 'input1.csv'
const result = []

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
        result.push(row)
    })
    .on('end', () =>{
        
        let data = []
        result.forEach((item, index) => {

            // INITIALIZE ARRAY ADDRESSES
            if (!item.addresses) {
                item.addresses = []
            }

            item.addresses = getAddress(item)

            // GET GROUP
            const groups = item.group ? item.group.split(',') : []
            // CHECK IF OBJECT IS DUPLICATED BY FULLNAME
            const value = _.find(data, {fullname: item.fullname})

            if (!value) {
                data.push({
                    fullname: item.fullname, 
                    eid: item.eid, 
                    groups: groups, 
                    addresses: item.addresses,
                    invisible: item.invisible === '' ? false : true,
                    see_all: item.see_all === '' || item.see_all === 'no' ? false : true,
                })
            } else {
                item.addresses = []
            }
        })

        fs.writeFileSync('output.json', JSON.stringify(data))
    })

// READ OBJECT KEYS SPLIT ONE OF THEM AND CREATE ADDRESS OBJECT WIT TAGS, TYPE, ADDRESS
getAddress = (item) => {
    let addresses = []

    for (let prop in item) {
                
        const splitKey = prop.split(' ')
        if (splitKey.length > 1) {
            let tags = []
            if (splitKey[2] !== undefined) {
                tags = [splitKey[1], splitKey[2]]
            } else {
                tags = [splitKey[1]]
            }

            const address = {
                type: splitKey[0],
                tags: tags,
                address: item[prop]
            }
            addresses.push(address)
        }
    }

    return addresses
}
