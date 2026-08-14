import type {
  UserProfile,
  EducationItem,
  SkillItem,
  ProjectItem,
  GalleryItem,
  CertificateItem,
  ContactMessage,
  SiteSettings,
  AdminUser,
  StatsOverview
} from '../types/index';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('rp_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const authHeaders = getAuthHeaders() as Record<string, string>;

  const headers: HeadersInit = isFormData
    ? { ...(authHeaders['Authorization'] ? { Authorization: authHeaders['Authorization'] } : {}) }
    : { ...authHeaders, ...(options.headers as Record<string, string> || {}) };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.error || 'Terjadi kesalahan pada permintaan');
  }
  return data;
}

export const api = {
  // Auth
  login: async (credentials: { email: string; password: string }) => {
    return request<{ success: boolean; token: string; user: AdminUser; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  getMe: async () => {
    return request<{ success: boolean; user: AdminUser }>('/auth/me');
  },

  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    return request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords)
    });
  },

  updateAccount: async (data: { email: string; name: string }) => {
    return request<{ success: boolean; message: string; user: AdminUser }>('/auth/account', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Profile
  getProfile: async () => {
    return request<{ success: boolean; data: UserProfile }>('/profile');
  },

  updateProfile: async (profile: Partial<UserProfile>) => {
    return request<{ success: boolean; message: string; data: UserProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  },

  // Education
  getEducation: async () => {
    return request<{ success: boolean; data: EducationItem[] }>('/education');
  },

  addEducation: async (item: Partial<EducationItem>) => {
    return request<{ success: boolean; message: string; data: EducationItem }>('/education', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateEducation: async (id: string, updates: Partial<EducationItem>) => {
    return request<{ success: boolean; message: string; data: EducationItem }>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteEducation: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/education/${id}`, {
      method: 'DELETE'
    });
  },

  reorderEducation: async (orderedIds: string[]) => {
    return request<{ success: boolean; data: EducationItem[] }>('/education/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds })
    });
  },

  // Skills
  getSkills: async () => {
    return request<{ success: boolean; data: SkillItem[] }>('/skills');
  },

  addSkill: async (item: Partial<SkillItem>) => {
    return request<{ success: boolean; message: string; data: SkillItem }>('/skills', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateSkill: async (id: string, updates: Partial<SkillItem>) => {
    return request<{ success: boolean; message: string; data: SkillItem }>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteSkill: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/skills/${id}`, {
      method: 'DELETE'
    });
  },

  reorderSkills: async (orderedIds: string[]) => {
    return request<{ success: boolean; data: SkillItem[] }>('/skills/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds })
    });
  },

  // Projects
  getProjects: async () => {
    return request<{ success: boolean; data: ProjectItem[] }>('/projects');
  },

  getAllProjectsAdmin: async () => {
    return request<{ success: boolean; data: ProjectItem[] }>('/projects/all');
  },

  addProject: async (item: Partial<ProjectItem>) => {
    return request<{ success: boolean; message: string; data: ProjectItem }>('/projects', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateProject: async (id: string, updates: Partial<ProjectItem>) => {
    return request<{ success: boolean; message: string; data: ProjectItem }>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteProject: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/projects/${id}`, {
      method: 'DELETE'
    });
  },

  reorderProjects: async (orderedIds: string[]) => {
    return request<{ success: boolean; data: ProjectItem[] }>('/projects/reorder', {
      method: 'POST',
      body: JSON.stringify({ orderedIds })
    });
  },

  // Gallery
  getGallery: async () => {
    return request<{ success: boolean; data: GalleryItem[] }>('/gallery');
  },

  getAllGalleryAdmin: async () => {
    return request<{ success: boolean; data: GalleryItem[] }>('/gallery/all');
  },

  addGalleryItem: async (item: Partial<GalleryItem>) => {
    return request<{ success: boolean; message: string; data: GalleryItem }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateGalleryItem: async (id: string, updates: Partial<GalleryItem>) => {
    return request<{ success: boolean; message: string; data: GalleryItem }>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteGalleryItem: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/gallery/${id}`, {
      method: 'DELETE'
    });
  },

  // Certificates
  getCertificates: async () => {
    return request<{ success: boolean; data: CertificateItem[] }>('/certificates');
  },

  addCertificate: async (item: Partial<CertificateItem>) => {
    return request<{ success: boolean; message: string; data: CertificateItem }>('/certificates', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  },

  updateCertificate: async (id: string, updates: Partial<CertificateItem>) => {
    return request<{ success: boolean; message: string; data: CertificateItem }>(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteCertificate: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/certificates/${id}`, {
      method: 'DELETE'
    });
  },

  // Messages
  sendMessage: async (msg: { name: string; email: string; subject?: string; message: string }) => {
    return request<{ success: boolean; message: string }>('/messages', {
      method: 'POST',
      body: JSON.stringify(msg)
    });
  },

  getMessages: async () => {
    return request<{ success: boolean; data: ContactMessage[] }>('/messages');
  },

  markMessageRead: async (id: string, isRead: boolean = true) => {
    return request<{ success: boolean; message: string }>(`/messages/${id}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead })
    });
  },

  deleteMessage: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/messages/${id}`, {
      method: 'DELETE'
    });
  },

  // Settings & Stats
  getSettings: async () => {
    return request<{ success: boolean; data: SiteSettings }>('/settings');
  },

  updateSettings: async (settings: Partial<SiteSettings>) => {
    return request<{ success: boolean; message: string; data: SiteSettings }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },

  getStats: async () => {
    return request<{ success: boolean; data: StatsOverview }>('/settings/stats');
  },

  backupDatabase: async () => {
    return request<{ success: boolean; exportedAt: string; data: any }>('/settings/backup');
  },

  restoreDatabase: async (data: any) => {
    return request<{ success: boolean; message: string; data: any }>('/settings/restore', {
      method: 'POST',
      body: JSON.stringify({ data })
    });
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('rp_admin_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/upload/single`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Gagal mengunggah file');
    }
    return data;
  }
};
