const mongoose = require('mongoose');

const interviewsScheduledSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    candidateId: { 
        type: String,  
        ref: 'User',  
        required: true 
    },
    interviewerId: { 
        type: String,  
        ref: 'User', 
        required: true 
    },
    company: { type: String, required: true  },
    role: { type: String, required: true },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled'], 
        default: 'Scheduled' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Interviews', interviewsScheduledSchema);
