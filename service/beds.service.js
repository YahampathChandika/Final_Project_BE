const { Beds } = require("../models");

//Add Bed
async function addBed(bed) {
    try {
        const newBed = await Beds.create({
            bedNo: bed.bedNo,
            available: true
        });   
        return {
            error: false,
            payload: "Successfully created the bed."
        }
    } catch (error) {
        throw error;
    }

}

//Get All Beds
async function getAllBeds() {
    try {
        const beds = await Beds.findAll();
        return{
            error: false,
            payload: beds
        }  
        
    } catch (error) {
        throw error;
    }
}

async function getAvailableBeds() {
    try {
        const avaiBeds = await Beds.findAll({
            where: {
                available: true
            }
        })
        
        if(!avaiBeds) {
            return {
                error: true,
                status: 404,
                payload: "No available beds."
                
            }
        } else {
            return {
                error: false,
                payload: avaiBeds
            }
        }

    } catch (error) {
        throw error;
    }
}
 
module.exports = {
    addBed,
    getAllBeds,
    getAvailableBeds
}