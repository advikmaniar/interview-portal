const mongoose = require('mongoose');

const interviewsScheduledSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    candidateId: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  
        required: true 
    },
    interviewerId: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User', 
        required: true 
    },
    company: { type: String, required: true  },
    role: { type: String, required: true },
    notes: { type: String },
    level: { 
        type: String, 
        enum: ['Initial', 'Intermediate', 'Final'], 
        default: 'Initial' 
    },
    type: { 
        type: String, 
        enum: ['Behavioural Round', 'Technical Round', 'Resume Review'], 
        default: 'Resume Review' 
    },
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Canceled' ,'Overdue'], 
        default: 'Scheduled' 
    },
}, { timestamps: true });

module.exports = mongoose.model('Interviews', interviewsScheduledSchema);
