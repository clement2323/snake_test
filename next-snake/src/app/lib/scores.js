export async function getPersonalHighScore(playerId) {
  if (!playerId) {
    console.warn('No playerId provided to getPersonalHighScore');
    return 0;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/highscore/player/${playerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 204) {
        // No content means no high score yet
        return 0;
      }
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data.highScore;
  } catch (error) {
    console.error('Error fetching personal high score:', error.message);
    return 0;
  }
}

export async function getGlobalHighScore() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/games/highscore/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { score: data.high_score, nom_utilisateur: data.nom_utilisateur };
    } else {
      throw new Error('Failed to fetch global high score');
    }
  } catch (error) {
    console.error('Error fetching global high score:', error);
    return { score: null, nom_utilisateur: null };
  }
}
