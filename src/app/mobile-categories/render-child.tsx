import Link from "next/link";
// LOCAL CUSTOM COMPONENTS
import NavAccordion from "./nav-accordion";
// CUSTOM DATA MODEL
import { CategoryMenuItem } from "models/Category.model";

export default function renderChild(categories: CategoryMenuItem[]) {
    return categories.map((item, i) => {
        if (item.children?.length) return <NavAccordion item={item} key={item.href ?? i} />;

        return (
            <Link href={item.href} key={item.href ?? i} className="link">
                {item.title}
            </Link>
        );
    });
}
