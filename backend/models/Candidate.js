const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    education: [
        {
            degree: { type: String, required: true },
            institution: { type: String, required: true },
            year: { type: Number, required: true }
        }
    ],
    experience: [
        {
            role: { type: String, required: true },
            company: { type: String, required: true },
            years: { type: Number, required: true }
        }
    ],
    skills: [
        { type: String, required: true }
    ],
    certifications: [
        {
            title: { type: String, required: true },
            issuedBy: { type: String, required: true },
            year: { type: Number, required: true }
        }
    ],
    projects: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            url: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('Candidate', CandidateSchema);


