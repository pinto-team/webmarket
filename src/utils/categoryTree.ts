import { ProductCategory } from "@/types/shopData.types";

export function buildCategoryTree(flatCategories: ProductCategory[]): ProductCategory[] {
  const categoryMap = new Map<number, ProductCategory>();
  const rootCategories: ProductCategory[] = [];

  // Initialize all categories with empty children array
  flatCategories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [], parent: null });
  });

  // Build tree structure
  flatCategories.forEach(category => {
    const node = categoryMap.get(category.id)!;
    
    if (category.parent_id === null) {
      rootCategories.push(node);
    } else {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        node.parent = parent;
        parent.children.push(node);
      } else {
        // Orphaned category, add to root
        rootCategories.push(node);
      }
    }
  });

  return rootCategories;
}
