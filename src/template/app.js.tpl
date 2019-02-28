/**
 * 入口、导入组件样式、渲染
 */

import React from 'react';
import mirror, { render, Router } from 'mirrorx';
import Routers from "<%=router%>";

mirror.defaults({
    historyMode: "hash"
});
render( <Router>
            <Routers />
        </Router>, document.querySelector("#app"));