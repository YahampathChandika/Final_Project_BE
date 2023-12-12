const bedsService = require("../service/beds.service");

//Add Beds
async function addBeds(req,res) {
    try {
        const bed = req.body;
        console.log(bed);
        
        const result = await bedsService.addBed(bed);
        
        if(result.error) {
            return res.status(500).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(200).json ({
                error: false,
                payload: result.payload
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            error: true,
            payload: error.message
        })
    }
}

//Get  All Beds 
async function getAllBeds(req, res) {
    try {
        
        const result = await bedsService.getAllBeds();

        if(result.error) {
            return res.status(404).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(200).json ({
                error: false,
                payload: result.payload
            })
        }

    } catch (error) {
        return res.status(500).json ({
            error: true,
            payload: error.message
        })
    }
}

async function getAvailableBeds(req, res) {
    try {
        const result = await bedsService.getAvailableBeds();

        if(result.error) {
            return res.status(404).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(200).json ({
                error: false,
                payload:result.payload
            })
        }
        
    } catch (error) {
        return res.status(500).json ({
            error: true,
            payload: error.message
        })
        
    }
}



module.exports = {
    addBeds,
    getAllBeds,
    getAvailableBeds
}