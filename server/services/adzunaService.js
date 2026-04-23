import axios from 'axios';

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const COUNTRY = 'in';

export const fetchAdzunaJobs = async (query = 'software engineer', page = 1) => {
  try {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      console.warn('⚠️ Adzuna API keys missing. Returning empty list.');
      return [];
    }

    const url = `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}`;
    const { data } = await axios.get(url, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: 20,
        what: query,
        content_type: 'application/json'
      }
    });

    return data.results.map(job => ({
      _id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company.display_name,
      description: job.description,
      location: job.location.display_name,
      type: job.contract_type === 'full_time' ? 'Full-time' : 'Contract',
      salary: {
        min: job.salary_min || 0,
        max: job.salary_max || 0,
        currency: 'INR'
      },
      url: job.redirect_url,
      postedAt: job.created,
      source: 'Adzuna'
    }));
  } catch (error) {
    console.error('❌ Adzuna API Error:', error.message);
    return [];
  }
};
