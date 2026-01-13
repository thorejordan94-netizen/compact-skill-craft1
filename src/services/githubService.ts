const GIST_FILENAME = "thm_career_mapper_data.json";
const GIST_DESCRIPTION = "THM Career Mapper Persistence Store";

interface GistFile {
  content: string;
}

interface Gist {
  id: string;
  files: Record<string, GistFile>;
  description: string;
}

export const findExistingGist = async (token: string): Promise<string | null> => {
  try {
    const response = await fetch("https://api.github.com/gists", {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch gists: ${response.statusText}`);
    }

    const gists: Gist[] = await response.json();
    const existing = gists.find((g) => g.description === GIST_DESCRIPTION && g.files[GIST_FILENAME]);

    return existing ? existing.id : null;
  } catch (error) {
    console.error("Error finding existing gist:", error);
    throw error;
  }
};

export const loadFromGist = async (token: string, gistId: string): Promise<any> => {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load gist: ${response.statusText}`);
    }

    const gist: Gist = await response.json();
    const file = gist.files[GIST_FILENAME];

    if (!file) {
      throw new Error(`File ${GIST_FILENAME} not found in gist`);
    }

    return JSON.parse(file.content);
  } catch (error) {
    console.error("Error loading from gist:", error);
    throw error;
  }
};

export const saveToGist = async (token: string, data: any, gistId: string | null): Promise<string> => {
  try {
    const url = gistId ? `https://api.github.com/gists/${gistId}` : "https://api.github.com/gists";
    const method = gistId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: GIST_DESCRIPTION,
        public: false,
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 404 && gistId) {
        console.warn("Gist ID not found on GitHub, creating a new one...");
        return saveToGist(token, data, null);
      }
      console.error(`Gist Save Error (${response.status}):`, errText);
      throw new Error(`Failed to save to gist: ${response.statusText}`);
    }

    const result: Gist = await response.json();
    return result.id;
  } catch (error) {
    console.error("Error saving to gist:", error);
    throw error;
  }
};
