import axiosInstance from '@/utils/axiosInstance';

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
    // backend image pipeline (preferred)
    upload?: { proxy_url?: string; main_url?: string; thumb_url?: string };

    // legacy attaches (keep optional, but allow proxy too if backend adds later)
    attaches?: Array<{ proxy_url?: string; main_url?: string }>;
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
    // Create a map with parent_id as key for quick lookup
    const idMap = new Map<number, CategoryApiResponse>();
    flatCategories.forEach((cat, index) => {
        idMap.set(index + 1, cat); // Assuming 1-based indexing from parent_id
    });

    const categoryMap = new Map<number, CategoryResource & { id: number }>();

    // Create all category objects with their IDs
    flatCategories.forEach((cat, index) => {
        const id = index + 1;
        categoryMap.set(id, {
            id,
            title: cat.name,
            code: cat.slug,
            description: cat.description,
            children: []
        });
    });

    const rootCategories: CategoryResource[] = [];

    // Build hierarchy
    flatCategories.forEach((cat, index) => {
        const id = index + 1;
        const category = categoryMap.get(id)!;

        if (cat.parent_id === null) {
            // Root category
            const {id: _, ...rootCat} = category;
            rootCategories.push(rootCat);
        } else {
            // Add to parent's children
            const parent = categoryMap.get(cat.parent_id);
            if (parent) {
                const {id: _, ...childCat} = category;
                parent.children!.push(childCat);
            }
        }
    });

    return rootCategories;
};

export const getCategories = async (): Promise<CategoryResource[]> => {
    const response = await axiosInstance.get<ApiResponse<CategoryApiResponse[]>>('/product-cats');
    const tree = buildCategoryTree(response.data.data);
    return tree;
};

export const getCategoryByCode = async (
    code: string,
    params?: ProductListParams
): Promise<{ category: CategoryResource; products: PaginatedResponse<ProductResource> }> => {
    const response = await axiosInstance.get<ApiResponse<{
        category: CategoryResource;
        products: PaginatedResponse<ProductResource>
    }>>(
        `/product-cats/${code}`,
        {params}
    );
    return response.data.data;
};
