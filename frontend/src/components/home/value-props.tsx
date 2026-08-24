export function ValueProps() {
    return (
        <section className="border-y border-outline-variant/30 py-8 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest full-width">
            <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-center justify-center gap-3 text-center md:text-left">
                    <span className="material-symbols-outlined text-primary text-[24px]" data-icon="local_shipping">local_shipping</span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-center md:text-left">
                    <span className="material-symbols-outlined text-primary text-[24px]" data-icon="cached">cached</span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">30-Day Free Returns</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-center md:text-left">
                    <span className="material-symbols-outlined text-primary text-[24px]" data-icon="lock">lock</span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">Secure Checkout</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-center md:text-left">
                    <span className="material-symbols-outlined text-primary text-[24px]" data-icon="support_agent">support_agent</span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">24/7 Client Support</span>
                </div>
            </div>
        </section>
    );
}
