import type { ApiResponse } from "@/types"

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // کوکی نشست ادمین را همراه هر درخواست ارسال می‌کند
    })
    const json = (await res.json()) as ApiResponse<T>

    if (!json.success) {
      return { data: null, error: json.error.message, status: res.status }
    }
    return { data: json.data, error: null, status: res.status }
  } catch {
    return { data: null, error: "خطا در برقراری ارتباط با سرور. اتصال اینترنت را بررسی کنید.", status: 0 }
  }
}
