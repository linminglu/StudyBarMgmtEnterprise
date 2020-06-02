var operation_pcom = {
    delimiters: ['<{', '}>'],
    template: "#operation_id",
    data: function () {
        return {

        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom
    },
    filters: {

    },
    watch: {

    },
    methods: {
        //运营方式
        chooseOperation(index) {

            switch (index) {
                case 1:
                    {
                        this.$router.push({
                            path: '/boutiquecourse',
                            query: {

                            }
                        });
                    }
                    break
                case 2:
                    {
                        this.$router.push({
                            path: '/superanchor',
                            query: {

                            }
                        });
                    }
                    break
                case 3:
                    {
                        this.$router.push({
                            path: '/freecourse',
                            query: {

                            }
                        });
                    }
                    break
                case 4:
                    {
                        this.$router.push({
                            path: '/limitdiscount',
                            query: {

                            }
                        });
                    }
                    break
                default:
                    break
            }
        }
    },
    mounted() {

    }
};