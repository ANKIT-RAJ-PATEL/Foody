import User from "../models/usermodel.js"
import Shop from "../models/shopmodel.js";
export const getCurrentUser = async (req,res) => {
   try {
    const userId = req.userId;
    if(!userId){
        return res.status(401).json({message: "userId not found"});
    }
    const user=await User.findById(userId).select("-password");
    if(!user){
        return res.status(404).json({message: "user not found"});
    }
    console.log("user found successfully")
    return res.status(200).json(user);
   } catch (error) {
    return res.status(500).json({message: ` getCurrentUser error: ${error}`});
   } 
}

export const updateUserLocation = async (req,res) => {
    try {
        const {lat,lon} = req.body;
        const user = await User.findByIdAndUpdate(req.userId,{
            location: {
                type: "Point",
                coordinates: [lon,lat]
            }
        },{new:true});
        if(!user){
            return res.status(404).json({message: "user not found"});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({message: `updateUserLocation error: ${error}`});
    }
}