const express = require('express');
const app = express();
const router = express.Router();
const rpc = require('./thriftClient');
const cors = require('cors');

let port = 3000;

app.use(cors());

app.use(express.static('../Client/build'))

router.get('/actions', async (req, res) => {
    try {
        let action = req.query.method;
        let payload = req.query.payload;
        let ts = req.query.ts;

        if (!action || !ts) {
            throw {
                error: "Invalid query parameters!"
            }
        }

        let entry, result;
        if (payload) {
            let parts = payload.split(':');
            entry = parts[1].replace('}', '').trim().replace('[', '').replace(']', '').split(',');
        }

        switch (action) {
            case "IS-VALID-ENTRY":
                let sanitized = sanitize(entry);
                res.status(200).send(sanitized)
                break;
            case "CALCULATE-STATS":
                result = await rpc.calculateStats(sanitize(entry));
                if (result) {
                    res.status(200).send({
                        "mean": result[0],
                        "median": result[1],
                        "variance": result[2],
                        "std-dev": result[3]
                    });
                }
                break;
            case "GEN-RAND":
                result = await rpc.genRand();
                if (result) {
                    res.status(200).send({
                        list: result
                    });
                }
                break;
            default:
                throw {
                    error: "Invalid action!"
                }
        }
    } catch (ex) {
        console.log(ex);
        res.status(500).json(ex);
    }
});

const sanitize = (list) => {
    let retVal = [];
    if (list.length < 2) {
        throw {
            error: "Less then 2 numbers in the payload!"
        }
    }
    list.forEach(element => {
        let ele = parseInt(element);
        if (isNaN(ele)) {
            throw {
                error: "Invalid numbers in the payload!"
            }
        } else {
            retVal.push(ele);
        }
    });
    return retVal;
}

app.use(router);

app.listen(port, "localhost", () => {
    console.log("Starting server on port", port);
});