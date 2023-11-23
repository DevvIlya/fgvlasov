// index.js
const Mustache = require('mustache');
const fs = require('fs');
const axios = require('axios');
const MUSTACHE_MAIN_DIR = './main.mustache';

// Получите токен доступа из переменных окружения
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

async function getTopRepositories() {
  const username = 'fgvlasov';

  // Получите репозитории для пользователя
  const response = await axios.get(`https://api.github.com/fgvlasov/${username}/repos`, {
    headers: {
      Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    },
  });

  const repositories = response.data;

  // Получите количество коммитов для каждого репозитория
  const repoCommits = await Promise.all(
    repositories.map(async (repo) => {
      const commitsResponse = await axios.get(repo.commits_url.replace('{/sha}', ''), {
        headers: {
          Authorization: `Bearer ${GITHUB_API_TOKEN}`,
        },
      });

      const commitCount = commitsResponse.data.length;

      return { name: repo.name, commitCount };
    })
  );

  // Сортируйте репозитории по количеству коммитов в порядке убывания
  const sortedRepos = repoCommits.sort((a, b) => b.commitCount - a.commitCount);

  // Возьмите два наиболее коммитированных репозитория
  const topTwoRepos = sortedRepos.slice(0, 2);

  return topTwoRepos;
}

async function generateReadMe() {
  const topRepos = await getTopRepositories();

  // Объедините топовые репозитории с текущими данными
  const DATA = {
    name: 'Fedor',
    date: new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: 'Europe/Moscow',
    }),
    refresh_date: new Date().toLocaleString('en-GB'),
    top_repositories: topRepos,
  };

  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

generateReadMe();
