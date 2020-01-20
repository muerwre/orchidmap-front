// @flow
import React, { Fragment } from 'react';
import { Scroll } from '~/components/Scroll';
import { APP_INFO } from '~/constants/app_info';

export const AppInfoDialog = () => (
  <Fragment>
    <div style={{ flex: 1 }} />

    <div className="dialog-content">
      <div className="dialog-head">
        <div className="dialog-head-title">Orchid Map</div>
        <div className="small gray">
          версия {APP_INFO.VERSION || 1}.{APP_INFO.CHANGELOG[APP_INFO.VERSION].length || 0}.
          {APP_INFO.CHANGELOG[APP_INFO.VERSION][0].length - 1 || 0}
        </div>
        <hr />
        <div className="small app-info-list">
          <div>
            <div>Исходный код:</div>
            <a href="//github.com/muerwre/orchid-front" target="_blank">
              github.com/muerwre/orchid-front
            </a>
            <br />
            <a href="//github.com/muerwre/orchid-backend" target="_blank">
              github.com/muerwre/orchid-backend
            </a>
          </div>
          <div>
            <div>Frontend:</div>
            <a href="//reactjs.org/" target="_blank">
              ReactJS
            </a>
            ,{' '}
            <a href="//leafletjs.com" target="_blank">
              Leaflet
            </a>
            ,{' '}
            <a href="//www.liedman.net/leaflet-routing-machine/" target="_blank">
              Leaflet Routing Machine
            </a>{' '}
          </div>
          <div>
            <div>Backend:</div>
            <a href="//project-osrm.org/" target="_blank">
              OSRM
            </a>
            ,{' '}
            <a href="//golang.org/" target="_blank">
              Golang
            </a>
            ,{' '}
            <a href="//nginx.org/" target="_blank">
              Nginx
            </a>
            ,{' '}
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);
