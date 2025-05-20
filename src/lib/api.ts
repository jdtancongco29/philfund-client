import Cookies from "js-cookie";

export const apiBaseUrl = import.meta.env.VITE_API_URL;

export type HeaderItem = {
  key: string;
  value: string;
};

export interface FetchOptions extends RequestInit {
  auth?: boolean;      // Add Authorization header
  branch?: boolean;    // Add Branch ID header
  custom?: HeaderItem[]; // Add any custom headers
}

export const fetchWithHeaders = async (
  endpoint: string,
  options: FetchOptions = {}
) => {
  const token = Cookies.get('authToken');
  const userCookie = Cookies.get('user');

  // Declare branchId in outer scope
  let branchId: string | null = null;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      branchId = user.current_branch || null;
    } catch (error) {
      console.error('Failed to parse user cookie:', error);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Application': 'application/json',
    ...(options.headers as Record<string, string>), // Optional override
  };

  if (options.auth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.branch && branchId) {
    headers['X-Branch-Id'] = branchId;
  }

  if (options.custom) {
    options.custom.forEach(({ key, value }) => {
      headers[key] = value;
    });
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  
  return response.json();
};