import axiosInstance from "@/utils/axiosInstance";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface CategoryApiResponse {
    name: string;
    slug: string;
    description?: string;
    parent_id: number | null;
}

interface CategoryResource {
    title: string;
    code: string;
    description?: string;
    children?: CategoryResource[];
}

interface ProductResource {
    code: string;
    title: string;
    price: number;

    // ✅ backend image pipeline (canonical)
    upload?: { proxy_url?: string };

    // ✅ legacy attaches but proxy-only
    attaches?: Array<{ proxy_url?: string }>;
}

interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

interface ProductListParams {
    paged?: number;
    count?: number;
    sort?: string;
    keyword?: string;
}

const buildCategoryTree = (flatCategories: CategoryApiResponse[]): CategoryResource[] => {
    const categoryMap = new Map<number, CategoryResource & { id: number }>();

    flatCategories.forEach((cat, index) => {
        const id = index + 1;
        categoryMap.set(id, {
            id,
            title: cat.name,
            code: cat.slug,
            description: cat.description,
            children: [],
        });
    });

    const rootCategories: CategoryResource[] = [];

    flatCategories.forEach((cat, index) => {
        const id = index + 1;
        const category = categoryMap.get(id)!;

        if (cat.parent_id === null) {
            const { id: _, ...rootCat } = category;
            rootCategories.push(rootCat);
        } else {
            const parent = categoryMap.get(cat.parent_id);
            if (parent) {
                const { id: _, ...childCat } = category;
                parent.children!.push(childCat);
            }
        }
    });

    return rootCategories;
};

export const getCategories = async (): Promise<CategoryResource[]> => {
    const response = await axiosInstance.get<ApiResponse<CategoryApiResponse[]>>("/product-cats");
    return buildCategoryTree(response.data.data);
};

export const getCategoryByCode = async (
    code: string,
    params?: ProductListParams
): Promise<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }> => {
    const response = await axiosInstance.get<
        ApiResponse<{
            category: CategoryResource;
            products: PaginatedResponse<ProductResource>;
        }>
    >(`/product-cats/${code}`, { params });

    return response.data.data;
};