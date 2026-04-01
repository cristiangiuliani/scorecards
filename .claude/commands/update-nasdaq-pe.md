Fetch the current NASDAQ 100 P/E ratio from GuruFocus and update the config file.

Steps:
1. Use WebFetch to get https://www.gurufocus.com/economic_indicators/6778/nasdaq-100-pe-ratio
2. Extract the current P/E ratio value from the page (it's the main indicator value displayed prominently)
3. Get today's date in DD-MM-YYYY format
4. Edit `src/constants/config.ts` to update the `NASDAQ_PE_RATIO` object:
   - `value`: the extracted number (as a float, e.g. 34.72)
   - `lastUpdated`: today's date in DD-MM-YYYY format
   - `source`: keep as 'GuruFocus'
5. Report the old value, the new value, and confirm the file was updated.
