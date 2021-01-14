import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document'


class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head />
                <body className="max-w-lg mx-auto">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument