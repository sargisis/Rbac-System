import crypto from 'crypto'
import User from '../models/User.js'
import sendResetEmail from '../utils/sendReset.js';

export const requestReset = async (req, res) => {
    try {
        const {email} = req.body; 
        const user = await User.findOne({email});
        if (!user) res.status(500).json({message: 'Mail not found'})

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 1000 * 60 * 60;

        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpires;
        await user.save()

        await sendResetEmail(email , resetToken);
        res.json({message: 'Reset link sent to email'});
    }catch(err) {
        console.error('Request reset error:' ,err);
        res.status(500).json({message: "Error requesting reset" , err})
    }
}

export default requestReset;