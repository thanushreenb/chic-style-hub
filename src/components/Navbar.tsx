import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingBag, Search, LogOut, User, Sun, Moon } from "lucide-react";
import { useCart, useWishlist, useAuth, useTheme } from "@/lib/store";
import { useState } from "react";

export function Navbar() {
  const { count } = useCart();
  const { list } = useWishlist();
  const { user, logout } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate({ to: "/search", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-1 shrink-0">
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            My Store
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase">
          <Link to="/category/$cat" params={{ cat: "men" }} className="hover:text-primary transition-colors py-2">Men</Link>
          <Link to="/category/$cat" params={{ cat: "women" }} className="hover:text-primary transition-colors py-2">Women</Link>
          <Link to="/category/$cat" params={{ cat: "kids" }} className="hover:text-primary transition-colors py-2">Kids</Link>
          
        </nav>

        <form onSubmit={onSearch} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full bg-muted/60 hover:bg-muted focus:bg-card border border-transparent focus:border-primary/40 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none transition"
          />
        </form>

        <div className="flex items-center gap-1 md:gap-4 text-xs font-semibold">
          {user ? (
            <>
              <Link to="/profile" className="hidden sm:flex flex-col items-center px-2 hover:text-primary transition" title="Profile">
                <User className="w-5 h-5" />
                <span className="mt-0.5">Profile</span>
              </Link>
              <button onClick={logout} className="hidden sm:flex flex-col items-center px-2 hover:text-primary transition" title={`Logout ${user.name || user}`}>
                <LogOut className="w-5 h-5" />
                <span className="mt-0.5">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden sm:flex flex-col items-center px-2 hover:text-primary transition">
              <User className="w-5 h-5" />
              <span className="mt-0.5">Login</span>
            </Link>
          )}
          <Link to="/wishlist" className="flex flex-col items-center px-2 hover:text-primary transition relative">
            <Heart className="w-5 h-5" />
            <span className="mt-0.5 hidden sm:block">Wishlist</span>
            {list.length > 0 && (
              <span className="absolute -top-1 right-0 bg-primary text-primary-foreground text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{list.length}</span>
            )}
          </Link>
          <Link to="/cart" className="flex flex-col items-center px-2 hover:text-primary transition relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="mt-0.5 hidden sm:block">Bag</span>
            {count > 0 && (
              <span className="absolute -top-1 right-0 bg-primary text-primary-foreground text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{count}</span>
            )}
          </Link>
        </div>
      </div>

      <nav className="md:hidden flex items-center justify-around border-t border-border text-xs font-semibold uppercase py-2">
        <Link to="/category/$cat" params={{ cat: "men" }} className="hover:text-primary">Men</Link>
        <Link to="/category/$cat" params={{ cat: "women" }} className="hover:text-primary">Women</Link>
        <Link to="/category/$cat" params={{ cat: "kids" }} className="hover:text-primary">Kids</Link>
      </nav>
    </header>
  );
}
