import Document, { Head, Html, Main, NextScript } from 'next/document'

import React from 'react';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head />
                <body className="mx-auto">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument