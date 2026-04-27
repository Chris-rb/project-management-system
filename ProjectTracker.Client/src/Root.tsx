import { Outlet } from "react-router-dom"

const Root = () => {
    return (
        <main className="h-full w-full main-wrapper">
            <Outlet />
        </main>
    )
}

export default Root;