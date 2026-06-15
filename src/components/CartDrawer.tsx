import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ExternalLink, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useCurrencyStore, convertPrice, type CurrencyCode } from "@/stores/currencyStore";
import { PriceDisplay } from "@/components/PriceDisplay";

export function CartDrawer() {
  const {
    items,
    isOpen,
    setOpen,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "CAD";
  const preferredCurrency = useCurrencyStore((s) => s.currency);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex h-full w-full flex-col bg-background sm:max-w-md">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-2xl italic tracking-tight">Your bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Nothing here yet."
              : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-6">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Your bag is empty.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 border-b border-border/60 pb-5">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-secondary/40">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h4 className="truncate text-sm font-medium">
                            {item.product.node.title}
                          </h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.selectedOptions.map((o) => o.value).join(" · ")}
                          </p>
                        </div>
                        <div className="mt-2 flex items-end justify-between gap-2">
                          <div className="flex items-center border border-border">
                            <button
                              aria-label="Decrease"
                              className="grid h-11 w-11 place-items-center hover:bg-secondary/60"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span aria-live="polite" aria-atomic="true" className="w-10 text-center text-sm">{item.quantity}</span>
                            <button
                              aria-label="Increase"
                              className="grid h-11 w-11 place-items-center hover:bg-secondary/60"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="text-sm font-medium">
                            <PriceDisplay amount={item.price.amount} currency={item.price.currencyCode} />
                          </p>
                        </div>
                      </div>
                      <button
                        aria-label="Remove"
                        className="grid h-11 w-11 place-items-center self-start text-muted-foreground hover:text-foreground"
                        onClick={() => removeItem(item.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 border-t border-border bg-background pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-2xl">
                    <PriceDisplay amount={totalPrice.toFixed(2)} currency={currency} />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes & shipping calculated at checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="h-12 w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Checkout
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
